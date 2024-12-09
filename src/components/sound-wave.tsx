import React, { useRef, useEffect, useState } from 'react'

const SoundWave: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
    const animationRef = useRef<number>()

    useEffect(() => {
        const setupAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                const context = new AudioContext()
                const source = context.createMediaStreamSource(stream)
                const analyserNode = context.createAnalyser()
                analyserNode.fftSize = 2048
                source.connect(analyserNode)

                setAudioContext(context)
                setAnalyser(analyserNode)
            } catch (error) {
                console.error('Error accessing microphone:', error)
            }
        }

        setupAudio()

        return () => {
            if (audioContext) {
                audioContext.close()
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (!analyser || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')!
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw)

            analyser.getByteTimeDomainData(dataArray)

            ctx.fillStyle = 'rgb(0, 0, 0)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.lineWidth = 2
            ctx.strokeStyle = 'rgb(255,255, 255)'
            ctx.beginPath()

            const sliceWidth = (canvas.width * 1.0) / bufferLength
            let x = 0

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0
                const y = (v * canvas.height) / 2

                if (i === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }

                x += sliceWidth
            }

            ctx.lineTo(canvas.width, canvas.height / 2)
            ctx.stroke()
        }

        draw()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [analyser])

    return (
        <div className="w-full mx-auto p-4 bg-red-500">
            <canvas
                ref={canvasRef}
                width={800}
                height={200}
                className="w-full border bg-black border-gray-300 rounded-lg"
            />
        </div>
    )
}

export default SoundWave

