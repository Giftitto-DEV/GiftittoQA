export const USUARIOS_DEMO = [
  { email: "demo@giftitto.com", password: "demo123", nombre: "Usuario Demo" },
  { email: "ana@giftitto.com", password: "ana123", nombre: "Ana Pérez" },
] as const;

export const MARCAS = [
  { id: "cinemax", nombre: "CineMax", montos: [2000, 5000, 10000] },
  { id: "gustoexpress", nombre: "GustoExpress", montos: [1500, 3000, 6000] },
  { id: "modaviva", nombre: "ModaViva", montos: [2000, 4000, 8000] },
  { id: "tecnoplus", nombre: "TecnoPlus", montos: [5000, 10000, 20000] },
];

export const GIFTCARDS_MOCK: Record<string, { marca: string; monto: number; codigo: string }[]> = {
  "demo@giftitto.com": [
    { marca: "CineMax", monto: 5000, codigo: "GC-1001-A" },
    { marca: "GustoExpress", monto: 3000, codigo: "GC-1002-B" },
  ],
  "ana@giftitto.com": [
    { marca: "ModaViva", monto: 4000, codigo: "GC-2002-X" },
    { marca: "TecnoPlus", monto: 10000, codigo: "GC-2003-Y" },
  ],
};

export function generarCodigo() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "GC-";
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}
