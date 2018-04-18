import preact from 'preact'

import GetFiles from './GetFiles.jsx'
import withIpfs from './IpfsContainer.jsx'

const getFilesHoc = (Component) => (
  class GetFilesContainer extends preact.Component {
    constructor (props) {
      super(props)
      this.nextId = 0
      this.state = {
        rootNode: null,
        ipfsState: 'connecting'
      }
    }

    componentDidMount () {
      this.getRootNodeFromIpfs()
    }

    componentDidUpdate () {
      this.getRootNodeFromIpfs()
    }

    getRootNodeFromIpfs = async () => {
      if (this.state.ipfsState !== 'connecting') return // already run so bail
      const {hash, ipfs} = this.props
      if (!hash) return console.log('no hash found')
      if (!ipfs) return console.log('waiting for ipfs')

      this.setState({
        ipfsState: 'getting'
      })

      const rootNode = await ipfs.object.get(hash)

      this.setState({
        rootNode: rootNode.toJSON(),
        ipfsState: 'done'
      })
    }

    render (props, {rootNode, ipfsState}) {
      return  <Component rootNode={rootNode} ipfsState={ipfsState} />
    }
  }
)

export default withIpfs(getFilesHoc(GetFiles))
