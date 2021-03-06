export default function Food({ dot }: { dot: [number, number] }) {
  const style = {
    left: `${dot[0]}%`,
    top: `${dot[1]}%`,
  }
  return <div className="snake-food" style={style}></div>
}
