import Writeup from './components/Writeup'
import WelcomeModal from './components/WelcomeModal'

export default function Home() {
  return (
    <div className="space-y-8">
      <WelcomeModal />
      <h2 className="text-3xl font-bold mb-6">Writeups</h2>
      <Writeup id={0} />
      <Writeup id={1} />
      <Writeup id={2} />
    </div>
  )
}

