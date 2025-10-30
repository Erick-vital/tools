<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    let status = "Not connected";
    let transcript = "";
    let partialTranscript = "";
    let isRecording = false;
    let language = 'en-US'; // Default language

    let socket: WebSocket | null = null;
    let audioContext: AudioContext | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let workletNode: AudioWorkletNode | null = null;
    let stream: MediaStream | null = null;

    async function toggleRecording() {
        isRecording = !isRecording;
        if (isRecording) {
            status = "Connecting...";
            transcript = ""; // Clear previous transcript
            partialTranscript = "";
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContext = new AudioContext();
                await audioContext.audioWorklet.addModule('/audio-processor.js');

                const sampleRate = audioContext.sampleRate;
                socket = new WebSocket(`ws://localhost:3001?language=${language}&sampleRate=${sampleRate}`);

                socket.onopen = () => {
                    status = "Recording...";
                    microphone = audioContext.createMediaStreamSource(stream);
                    workletNode = new AudioWorkletNode(audioContext, 'audio-processor');

                    workletNode.port.onmessage = (event) => {
                        const pcmData = event.data; // This is a Float32Array
                        const int16Data = new Int16Array(pcmData.length);
                        for (let i = 0; i < pcmData.length; i++) {
                            int16Data[i] = pcmData[i] * 32767;
                        }

                        if (socket?.readyState === WebSocket.OPEN) {
                            socket.send(int16Data.buffer);
                        }
                    };

                    microphone.connect(workletNode).connect(audioContext.destination);
                };

                socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.isPartial) {
                        partialTranscript = data.transcript;
                    } else {
                        transcript += data.transcript + ' ';
                        partialTranscript = "";
                    }
                };

                socket.onclose = () => {
                    status = "Disconnected";
                    isRecording = false;
                    stopAudioProcessing();
                };

                socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    status = "Error";
                    isRecording = false;
                };

            } catch (error) {
                console.error('Error setting up audio:', error);
                status = `Error: ${error.message}`;
                isRecording = false;
            }
        } else {
            status = "Stopped";
            stopAudioProcessing();
            socket?.close();
        }
    }

    function stopAudioProcessing() {
        stream?.getTracks().forEach(track => track.stop());
        microphone?.disconnect();
        workletNode?.disconnect();
        audioContext?.close();
    }

    onDestroy(() => {
        if (isRecording) {
            stopAudioProcessing();
            socket?.close();
        }
    });
</script>

<div class="container">
    <h1>Real-time Transcription</h1>
    <p>Status: {status}</p>

    <div class="controls">
        <label for="language">Language:</label>
        <select id="language" bind:value={language} disabled={isRecording}>
            <option value="en-US">English (US)</option>
            <option value="en-IN">English (IN)</option>
        </select>
        <button on:click={toggleRecording}>
            {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
    </div>

    <textarea rows="10" readonly>{transcript + partialTranscript}</textarea>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
    }

    .controls {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    textarea {
        width: 100%;
        max-width: 600px;
    }
</style>
