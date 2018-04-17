import preact from 'preact'
import getIpfs from 'window.ipfs-fallback'

import GetFiles from './GetFiles.jsx'

const getFilesHoc = (Component) => (
  class GetFilesContainer extends preact.Component {

    state = {
      dagNode: null,
      ipfsState: 'connecting'
    }

    ipfs = null

    async componentWillMount () {
      const {hash} = this.props
      if (!hash) return console.log('no hash found')

      this.ipfs = await getIpfs({
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
      this.setState({
        ipfsState: 'getting'
      })
      const node = await this.ipfs.object.get(hash)
      this.setState({
        dagNode: node.toJSON(),
        ipfsState: 'done'
      })
    }

    render (props, {dagNode, ipfsState}) {
      return  <Component dagNode={dagNode} ipfsState={ipfsState} />
    }
  }
)

export default getFilesHoc(GetFiles)
