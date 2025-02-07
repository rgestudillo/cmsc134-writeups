import { NextResponse } from "next/server"

const links = [
  {
    id: 0,
    web3: "https://mirror.xyz/0x14995Acf9Dba6F5922e2847E86Eb94BD92D443Ac/cWum054tfGWf-fduOn0tXO3lFkR-BAbN97UgStv4QgY",
    documentation: "https://docs.google.com/document/d/e/2PACX-1vR6Qpk739U6vYvQ3N9hHakMw-7Ldx5P2mKEU0JjyBat3N8J3GfMSY49a7qr-xb8Tb8h3NQ2ZHBTWxiS/pub",
  },
  {
    id: 1,
    web3: "coming soon!",
    documentation: "coming soon!",
  },
  {
    id: 2,
    web3: "coming soon!",
    documentation: "coming soon!",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const type = searchParams.get("type")

  if (id === null || type === null) {
    return NextResponse.json({ error: "Missing id or type parameter" }, { status: 400 })
  }

  const link = links.find((link) => link.id === Number.parseInt(id))

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 })
  }

  if (type !== "web3" && type !== "documentation") {
    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
  }

  return NextResponse.json({ url: link[type] })
}

