import { NextResponse } from "next/server"

const links = [
  {
    id: 0,
    web3: "https://example.com/web3/post-0",
    documentation: "https://docs.example.com/post-0",
  },
  {
    id: 1,
    web3: "https://example.com/web3/post-1",
    documentation: "https://docs.example.com/post-1",
  },
  {
    id: 2,
    web3: "https://example.com/web3/post-2",
    documentation: "https://docs.example.com/post-2",
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

