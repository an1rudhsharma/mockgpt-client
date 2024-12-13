import React, { useRef, useEffect } from 'react'


interface SoundWaveProps {
    analyser: AnalyserNode | null;
    isUserFullScreen: boolean;
}

const SoundWave: React.FC<SoundWaveProps> = ({ analyser, isUserFullScreen }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()

    useEffect(() => {
        if (!analyser || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')!
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw)

            analyser.getByteTimeDomainData(dataArray)

            ctx.fillStyle = 'transparent'

            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        <div className="w-full h-full overflow-hidden p-[1px]">
            <canvas
                ref={canvasRef}
                width={isUserFullScreen ? 400 : 800}
                height={isUserFullScreen ? 200 : 400}
                className="w-full h-full rounded-lg"
            />
        </div>
    )
}

export default SoundWave

