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
          web3ButtonTitle="View Writeup"
          docsButtonTitle="View Documentation"
          web3SectionTitle="Writeup"
          docsSectionTitle="Documentation"
        />
        <Writeup
          id={1}
          title="MP #1 Documentation"
          web3Link="https://mirror.xyz/0x14995Acf9Dba6F5922e2847E86Eb94BD92D443Ac/yQ5HdC271Grfazn2JNakgGsUGAfim1QBh0LAwMAS4Ow"
          docsLink="https://docs.google.com/document/d/e/2PACX-1vQwy44erukRyzDByN-UIjjQ46OvhRvFDJ8V0jkrxddO8P9HsaRQtyVJ8t_I-YwDTNw62exVRcOjZ_AE/pub"
          web3ButtonTitle="View Writeup"
          docsButtonTitle="View Documentation"
          web3SectionTitle="Writeup"
          docsSectionTitle="Documentation"
        />
        <Writeup
          id={2}
          title="MP #2 Documentation"
          web3Link="https://mirror.xyz/0x14995Acf9Dba6F5922e2847E86Eb94BD92D443Ac/1B3s_9vq6JdJ5Og1OSmEj6XVm-jsL9pNQxn2RmlFQqc"
          docsLink="/rsa-encrypt"
          web3ButtonTitle="View Writeup"
          docsButtonTitle="View Interactive Demo"
          web3SectionTitle="Writeup"
          docsSectionTitle="Interactive Demo"
        />
        <Writeup
          id={3}
          title="MP #3 Documentation"
          web3Link="https://mirror.xyz/0x14995Acf9Dba6F5922e2847E86Eb94BD92D443Ac/VMolyRgdB39gpUOscMPcd8qxmaEHcROjwoEmvCF3uNQ"
          docsLink="https://drive.google.com/drive/folders/1UUu6SKhpmg_hp5vWdf1hNLD24uK-HTRt?fbclid=IwZXh0bgNhZW0CMTEAAR5n5iMnDzI5krFGFcsUz6eejDVq0izn_fN0qWfZCu2T2bEGETgMPRh5Zgtfgw_aem_ngbDqi49RJHg3HtSFyeHig"
          web3ButtonTitle="View Writeup"
          docsButtonTitle="View Source Code"
          web3SectionTitle="Writeup"
          docsSectionTitle="Source Code"
        />
        <Writeup
          id={4}
          title="Writeup 1: Tor-rific or Tor-rible?"
          web3Link="https://mirror.xyz/0x14995Acf9Dba6F5922e2847E86Eb94BD92D443Ac/oCvTCqmR4br8Ie40bGLBFcob2HhsM_ihUEYtcfHAUdk"
          docsLink="https://docs.google.com/document/d/e/2PACX-1vRYLm1Xdlfs-CPzPktnhIjsGOl7W3xIeGvAdXchY-N7HSXiJRHTyO1g8T5ZvMtPdeU_bLAaSidOgEAj/pub"
          web3ButtonTitle="View Writeup"
          docsButtonTitle="View Documentation"
          web3SectionTitle="Writeup"
          docsSectionTitle="Documentation"
        />
      </div>
    </div>
  )
}

