'use client';

export default function RetroConsoleBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Pillars of Creation nebula background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0015] via-[#1a0530] to-[#0f051a]">
        {/* Nebula clouds */}
        <div
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #8b4f9e 0%, #4a1f5c 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-[600px] h-[900px] rounded-full opacity-25 blur-[100px]"
          style={{
            background: 'radial-gradient(ellipse, #d4a574 0%, #7a4f3a 30%, transparent 60%)',
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full opacity-20 blur-[110px]"
          style={{
            background: 'radial-gradient(circle, #5a7ba6 0%, #2a3d5a 40%, transparent 70%)',
          }}
        />

        {/* Stars */}
        <div className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20% 30%, white, transparent),
              radial-gradient(2px 2px at 60% 70%, white, transparent),
              radial-gradient(1px 1px at 50% 50%, white, transparent),
              radial-gradient(1px 1px at 80% 10%, white, transparent),
              radial-gradient(2px 2px at 90% 60%, white, transparent),
              radial-gradient(1px 1px at 33% 80%, white, transparent),
              radial-gradient(1px 1px at 15% 70%, white, transparent)
            `,
            backgroundSize: '200px 200px, 300px 300px, 150px 150px, 250px 250px, 180px 180px, 220px 220px, 280px 280px',
            backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px, 160px 30px, 240px 180px, 90px 220px',
          }}
        />
      </div>

      {/* Planet surface - bottom third */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3">
        {/* Horizon glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#4a2f6f]/40 via-[#2a1a4f]/60 to-transparent blur-sm" />

        {/* Planet surface gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f2e] via-[#2a1845] to-transparent">
          {/* Texture noise */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                rgba(255,255,255,0.03) 0px,
                transparent 1px,
                transparent 2px,
                rgba(255,255,255,0.03) 3px
              )`,
            }}
          />
        </div>
      </div>

      {/* 90s Console Frame - centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[85%] max-w-6xl h-[80vh] max-h-[900px]">
          {/* Outer console bezel - beige/tan like 90s computer */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4c4a8] via-[#b8a88c] to-[#9a8a6e] rounded-3xl shadow-2xl"
            style={{
              boxShadow: `
                0 20px 60px rgba(0,0,0,0.8),
                inset 0 2px 4px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.3)
              `,
            }}
          >
            {/* Inner bezel - darker beveled edge */}
            <div className="absolute inset-4 bg-gradient-to-br from-[#8a7a5e] via-[#6a5a4e] to-[#5a4a3e] rounded-2xl"
              style={{
                boxShadow: `
                  inset 0 3px 8px rgba(0,0,0,0.6),
                  inset 0 -1px 4px rgba(255,255,255,0.1)
                `,
              }}
            >
              {/* Screen cutout - the actual viewing area */}
              <div className="absolute inset-6 bg-black rounded-xl overflow-hidden pointer-events-auto"
                style={{
                  boxShadow: `
                    inset 0 0 30px rgba(0,255,200,0.1),
                    0 0 20px rgba(0,0,0,0.8)
                  `,
                }}
              >
                {/* CRT scanlines effect */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      0deg,
                      rgba(0, 255, 200, 0.15) 0px,
                      transparent 1px,
                      transparent 2px,
                      rgba(0, 255, 200, 0.15) 3px
                    )`,
                  }}
                />

                {/* CRT screen glow */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(0,255,200,0.08) 0%, transparent 70%)',
                  }}
                />
              </div>

              {/* Console power LED - top right of bezel */}
              <div className="absolute top-2 right-8 w-3 h-3 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00cc66] animate-pulse"
                style={{
                  boxShadow: `
                    0 0 8px #00ff88,
                    0 0 12px #00ff8844,
                    inset 0 -1px 2px rgba(0,0,0,0.3)
                  `,
                }}
              />

              {/* Brand label - bottom right corner */}
              <div className="absolute bottom-3 right-8 text-[#5a4a3e] font-mono text-xs opacity-60 tracking-wider">
                137SYSTEMS™
              </div>
            </div>

            {/* Console stand indicator - subtle bottom protrusion */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-gradient-to-b from-[#9a8a6e] to-[#7a6a5e] rounded-b-lg"
              style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Ambient particles/dust in the air */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${8 + Math.random() * 12}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
