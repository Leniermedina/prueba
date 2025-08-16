'use client';
export default function QuantityInput({ value, onChange }: { value: number; onChange: (v:number)=>void }) {
  return (<div className="qty"><button className="btn small" onClick={() => onChange(Math.max(0, value - 1))}>−</button><input className="input" type="number" min={0} value={value} onChange={(e) => onChange(Math.max(0, parseInt(e.target.value || '0', 10)))} /><button className="btn small" onClick={() => onChange(Math.min(999, value + 1))}>+</button></div>);
}