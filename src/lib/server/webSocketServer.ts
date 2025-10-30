import { WebSocketServer, WebSocket } from 'ws';
import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from '@aws-sdk/client-transcribe-streaming';
import { URL } from 'url';
import { PassThrough } from 'stream';

export function startWebSocketServer() {
    const wss = new WebSocketServer({ port: 3001 });
    const transcribeClient = new TranscribeStreamingClient({ region: 'us-east-1' }); // Change to your desired region

    wss.on('connection', (ws, req) => {
        console.log('Client connected');

        const audioStream = new PassThrough();

        ws.on('message', (message, isBinary) => {
            if (isBinary) {
                audioStream.write(message);
            }
        });

        ws.on('close', (code, reason) => {
            console.log(`Client disconnected with code: ${code}, reason: ${reason.toString()}`);
            audioStream.end();
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            audioStream.destroy(error);
        });

        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const languageCode = url.searchParams.get('language') || 'en-US';
        const sampleRate = url.searchParams.get('sampleRate');

        if (!sampleRate) {
            console.error('Missing sampleRate parameter');
            ws.close(1011, 'Missing sampleRate');
            return;
        }

        const command = new StartStreamTranscriptionCommand({
            LanguageCode: languageCode,
            MediaSampleRateHertz: parseInt(sampleRate),
            MediaEncoding: 'pcm',
            EnablePartialResultsStabilization: true,
            PartialResultsStability: 'high',
            AudioStream: (async function*() {
                for await (const chunk of audioStream) {
                    yield { AudioEvent: { AudioChunk: chunk } };
                }
            })(),
        });

        transcribeClient.send(command).then(async (response) => {
            if (response.TranscriptResultStream) {
                for await (const event of response.TranscriptResultStream) {
                    if (event.TranscriptEvent && event.TranscriptEvent.Transcript) {
                        const results = event.TranscriptEvent.Transcript.Results;
                        if (results && results.length > 0 && results[0].Alternatives && results[0].Alternatives.length > 0) {
                            const transcript = results[0].Alternatives[0].Transcript;
                            if (transcript) {
                                if (ws.readyState === WebSocket.OPEN) {
                                    ws.send(JSON.stringify({
                                        isPartial: results[0].IsPartial,
                                        transcript: transcript
                                    }));
                                }
                            }
                        }
                    }
                }
            }
        }).catch((error) => {
            console.error('IMMEDIATE AWS Transcribe error:', error);
            if (ws.readyState === WebSocket.OPEN) {
                ws.close(1011, 'AWS Transcribe Error');
            }
        });
    });

    console.log('WebSocket server started on port 3001');
}
