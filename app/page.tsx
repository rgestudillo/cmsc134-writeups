import Writeup from "./components/Writeup"
import WelcomeModal from "./components/WelcomeModal"

export default function Home() {
  return (
    <div className="space-y-8">
      <WelcomeModal />
      <h1 className="text-4xl font-bold text-center mb-12">Kashi Tiris April Dexter Loui</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Writeup
          id={0}
          title="The Human Factor in Cybersecurity: Why People Are the Weakest Link"
          web3Link="https://mirror.xyz/0x14995Acf9Dba6F5922e2847E86Eb94BD92D443Ac/cWum054tfGWf-fduOn0tXO3lFkR-BAbN97UgStv4QgY"
          docsLink="https://docs.google.com/document/d/e/2PACX-1vR6Qpk739U6vYvQ3N9hHakMw-7Ldx5P2mKEU0JjyBat3N8J3GfMSY49a7qr-xb8Tb8h3NQ2ZHBTWxiS/pub"
        />
        <Writeup id={1} title="Write-up 1" />
        <Writeup id={2} title="Write-up 2" />
      </div>
    </div>
  )
}

