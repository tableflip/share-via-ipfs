import preact from 'preact'
import getIpfs from 'window.ipfs-fallback'

const withIpfs = (Component) => (
  class IpfsProvider extends preact.Component {
    constructor (props) {
      super(props)
      this.state = {
        ipfs: null
      }
    }

    async componentDidMount () {
      const ipfs = await getIpfs({
        ipfs: {
          config: {
            Addresses: {
              Swarm: [
                '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
              ]
            }
          }
        }
      })
      this.setState({ipfs})
    }

    render (props, {ipfs}) {
      return <Component ipfs={ipfs} {...props} />
    }
  }
)

export default withIpfs
