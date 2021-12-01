export default function Snake({
  snakeDots,
}: {
  snakeDots: [number, number][]
}) {
  return (
    <div>
      {snakeDots.map((dot, idx) => {
        const style = {
          left: `${dot[0]}%`,
          top: `${dot[1]}%`,
        }
        return <div className="snake-dot" key={idx} style={style}></div>
      })}
    </div>
  )
}
