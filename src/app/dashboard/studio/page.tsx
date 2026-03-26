"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  SlidersHorizontal,
  Mic2,
  Music2,
  Upload,
  Play,
  Pause,
  Volume2,
  Sparkles,
  Loader2,
  Square,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import { CardSpotlight } from "@/components/ui/card-spotlight";

const MUSIC_STYLES = [
  { id: "r&b", label: "R&B", desc: "Smooth grooves and soul" },
  { id: "bass", label: "Bass", desc: "Deep low-end focus" },
  { id: "pop", label: "Pop", desc: "Catchy and bright" },
  { id: "acoustic", label: "Acoustic", desc: "Organic and warm" },
  { id: "electronic", label: "Electronic", desc: "Synths and beats" },
  { id: "hiphop", label: "Hip-hop", desc: "Beats and flow" },
  { id: "jazz", label: "Jazz", desc: "Swing and improv" },
  { id: "bollywood", label: "Bollywood", desc: "Cinematic and lush" },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function StudioPage() {
  const [voiceLevel, setVoiceLevel] = useState(80);
  const [musicLevel, setMusicLevel] = useState(70);
  const [selectedStyle, setSelectedStyle] = useState(MUSIC_STYLES[0]);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [musicSource, setMusicSource] = useState<"generate" | "upload" | null>(null);
  const [isMixing, setIsMixing] = useState(false);
  const [mixedDone, setMixedDone] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [voicePreviewUrl, setVoicePreviewUrl] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voiceCurrentTime, setVoiceCurrentTime] = useState(0);
  const [voiceDuration, setVoiceDuration] = useState(0);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    setRecordingError(null);
    setRecordSeconds(0);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const options: MediaRecorderOptions = { mimeType, audioBitsPerSecond: 128000 };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const ext = mimeType.includes("webm") ? "webm" : "mp4";
          const file = new File([blob], `vocal-recording-${Date.now()}.${ext}`, {
            type: blob.type,
          });
          setVoiceFile(file);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      setRecordingError(err instanceof Error ? err.message : "Microphone access denied");
    }
  }, []);

  const handleStopRecording = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("audio/")) {
      setVoiceFile(f);
      setRecordingError(null);
    }
  };

  useEffect(() => {
    if (!voiceFile) {
      setVoicePreviewUrl(null);
      setIsPlayingVoice(false);
      setVoiceCurrentTime(0);
      setVoiceDuration(0);
      return;
    }
    const url = URL.createObjectURL(voiceFile);
    setVoicePreviewUrl(url);
    setIsPlayingVoice(false);
    setVoiceCurrentTime(0);
    setVoiceDuration(0);
    return () => URL.revokeObjectURL(url);
  }, [voiceFile]);

  const handleRemoveVoice = useCallback(() => {
    setVoiceFile(null);
    setIsPlayingVoice(false);
    setVoiceCurrentTime(0);
    setVoiceDuration(0);
  }, []);

  const handleVoicePlayPause = useCallback(() => {
    const audio = voiceAudioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlayingVoice(true);
    } else {
      audio.pause();
      setIsPlayingVoice(false);
    }
  }, []);

  const handleVoiceTimeUpdate = useCallback(() => {
    const audio = voiceAudioRef.current;
    if (audio) setVoiceCurrentTime(audio.currentTime);
  }, []);

  const handleVoiceLoadedMetadata = useCallback(() => {
    const audio = voiceAudioRef.current;
    if (audio) setVoiceDuration(audio.duration);
  }, []);

  const handleVoiceEnded = useCallback(() => {
    setIsPlayingVoice(false);
    setVoiceCurrentTime(0);
  }, []);

  const handleVoiceSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = voiceAudioRef.current;
    const v = Number(e.target.value);
    if (audio) {
      audio.currentTime = v;
      setVoiceCurrentTime(v);
    }
  }, []);

  const handleMix = () => {
    setIsMixing(true);
    setMixedDone(false);
    setTimeout(() => {
      setIsMixing(false);
      setMixedDone(true);
    }, 2000);
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-[1000px] mx-auto min-w-0">
      <div className="mb-6 sm:mb-8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal/15 flex items-center justify-center">
          <SlidersHorizontal className="w-5 h-5 text-teal" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-jet-black font-heading leading-tight">
            Studio
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300">
            Mix your singing with music — R&B, bass, and more. Use your voice and AI music to create your own track.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Voice track */}
        <CardSpotlight color="#00d4ff">
        <section className="rounded-xl bg-neutral-500/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-lavender-600 flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-teal" />
            <span className="font-semibold text-jet-black">Your voice (singing)</span>
          </div>
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-sm text-neutral-300">Upload or record your vocals to sing over the music. Sing naturally — recording captures your voice clearly.</p>
              <div className="flex flex-wrap items-center gap-2">
                <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${isRecording ? "opacity-50 pointer-events-none" : "bg-lavender-700 text-jet-black hover:bg-lavender-600"}`}>
                  <Upload className="w-4 h-4" />
                  Upload vocal
                  <input
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={handleVoiceUpload}
                    disabled={isRecording}
                  />
                </label>
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal/20 text-teal text-sm font-medium hover:bg-teal/30 transition-colors"
                    aria-label="Start recording"
                  >
                    <Mic2 className="w-4 h-4" />
                    Record
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                    <span className="font-mono text-sm tabular-nums">{formatTime(recordSeconds)}</span>
                    <span className="text-xs">Recording</span>
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="inline-flex items-center gap-1.5 ml-2 pl-2 border-l border-red-500/40 text-red-400 hover:text-red-300 font-medium"
                      aria-label="Stop recording"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      Stop
                    </button>
                  </div>
                )}
              </div>
              {recordingError && (
                <p className="text-xs text-red-400">{recordingError}</p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Volume2 className="w-5 h-5 text-neutral-400" aria-hidden />
              <input
                type="range"
                min={0}
                max={100}
                value={voiceLevel}
                onChange={(e) => setVoiceLevel(Number(e.target.value))}
                className="w-24 h-2 rounded-full appearance-none bg-lavender-600 accent-teal"
              />
              <span className="text-xs text-neutral-400 w-8">{voiceLevel}%</span>
            </div>
          </div>

          {/* Recorded vocal preview — listen before mixing */}
          {voiceFile && voicePreviewUrl && !isRecording && (
            <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
              <div className="rounded-lg bg-lavender-700/50 border border-lavender-600 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Headphones className="w-4 h-4 text-teal" />
                  <span className="font-medium text-jet-black text-sm">Your recording</span>
                  <span className="text-xs text-neutral-400 truncate flex-1">{voiceFile.name}</span>
                  <button
                    type="button"
                    onClick={handleRemoveVoice}
                    className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
                <audio
                  ref={voiceAudioRef}
                  src={voicePreviewUrl}
                  onTimeUpdate={handleVoiceTimeUpdate}
                  onLoadedMetadata={handleVoiceLoadedMetadata}
                  onEnded={handleVoiceEnded}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleVoicePlayPause}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-teal text-white hover:bg-teal-600 transition-colors shrink-0"
                    aria-label={isPlayingVoice ? "Pause" : "Play"}
                  >
                    {isPlayingVoice ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <input
                      type="range"
                      min={0}
                      max={voiceDuration || 1}
                      value={voiceCurrentTime}
                      onChange={handleVoiceSeek}
                      className="w-full h-2 rounded-full appearance-none bg-lavender-600 accent-teal cursor-pointer"
                    />
                  </div>
                  <span className="text-xs text-neutral-400 font-mono tabular-nums shrink-0 w-20">
                    {formatTime(Math.floor(voiceCurrentTime))} / {formatTime(Math.floor(voiceDuration) || 0)}
                  </span>
                </div>
                <p className="text-xs text-teal mt-2">
                  Listen to your recording. Happy with it? Scroll down and click Mix & create to blend with music.
                </p>
              </div>
            </div>
          )}
        </section>
        </CardSpotlight>

        {/* Music track */}
        <CardSpotlight color="#00d4ff">
        <section className="rounded-xl bg-neutral-500/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-lavender-600 flex items-center gap-2">
            <Music2 className="w-5 h-5 text-teal" />
            <span className="font-semibold text-jet-black">Music</span>
          </div>
          <div className="p-4 sm:p-6 flex flex-col gap-4">
            <p className="text-sm text-neutral-300">Choose a style and add AI-generated or your own music to mix with your voice.</p>

            {/* Style selector */}
            <div className="flex flex-wrap gap-2">
              {MUSIC_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedStyle.id === style.id
                      ? "bg-teal text-white"
                      : "bg-lavender-700 text-jet-black hover:bg-lavender-600"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-400">{selectedStyle.desc}</p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMusicSource("generate")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  musicSource === "generate"
                    ? "bg-teal text-white"
                    : "bg-lavender-700 text-jet-black hover:bg-lavender-600"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Generate {selectedStyle.label} music
              </button>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lavender-700 text-jet-black text-sm font-medium cursor-pointer hover:bg-lavender-600 transition-colors">
                <Upload className="w-4 h-4" />
                Upload track
                <input
                  type="file"
                  accept="audio/*"
                  className="sr-only"
                  onChange={() => setMusicSource("upload")}
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-neutral-400" aria-hidden />
              <input
                type="range"
                min={0}
                max={100}
                value={musicLevel}
                onChange={(e) => setMusicLevel(Number(e.target.value))}
                className="w-24 h-2 rounded-full appearance-none bg-lavender-600 accent-teal"
              />
              <span className="text-xs text-neutral-400 w-8">{musicLevel}%</span>
            </div>
          </div>
        </section>
        </CardSpotlight>

        {/* Mix CTA */}
        <CardSpotlight color="#00d4ff">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between rounded-xl bg-lavender-700/30 p-4 sm:p-6">
          <div>
            <h2 className="font-semibold text-jet-black mb-1">Create your track</h2>
            <p className="text-sm text-neutral-300">
              Blend your voice and music into one track, or use AI music as backing for your singing.
            </p>
          </div>
          <button
            type="button"
            onClick={handleMix}
            disabled={isMixing}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-teal text-white font-semibold hover:bg-teal-600 transition-colors disabled:opacity-70 shrink-0"
          >
            {isMixing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mixing…
              </>
            ) : mixedDone ? (
              "Mix again"
            ) : (
              <>
                <Play className="w-5 h-5" />
                Mix & create
              </>
            )}
          </button>
        </div>
        </CardSpotlight>

        {mixedDone && (
          <CardSpotlight color="#00d4ff">
          <div className="rounded-xl bg-teal/10 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center">
              <Music2 className="w-5 h-5 text-teal" />
            </div>
            <div>
              <p className="font-medium text-jet-black">Your mix is ready</p>
              <p className="text-sm text-neutral-300">Save or export from Library when backend is connected.</p>
            </div>
            <Link
              href="/dashboard/library"
              className="ml-auto text-sm font-medium text-teal hover:text-teal-600 transition-colors"
            >
              Open Library →
            </Link>
          </div>
          </CardSpotlight>
        )}

        <p className="text-xs text-neutral-400">
          Studio mixes are saved to your Library. Connect your microphone to record; upload WAV or MP3 for best quality.
        </p>
      </div>
    </div>
  );
}
