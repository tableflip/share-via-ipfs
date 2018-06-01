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

      const {value: rootNode} = await ipfs.dag.get(hash)

      // https://github.com/ipfs/interface-ipfs-core/issues/284#issuecomment-393931117
      // const info = await ipfs.stat(hash)
      // console.log(info)

      const files = await ipfs.ls(hash)

      this.setState({
        rootNode,
        files,
        ipfsState: 'done'
      })
    }

    render (props, {rootNode, files, ipfsState}) {
      return  <Component rootNode={rootNode} files={files} ipfsState={ipfsState} />
    }
  }
)

export default withIpfs(getFilesHoc(GetFiles))
