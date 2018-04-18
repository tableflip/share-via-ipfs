import preact from 'preact'

import AddFiles from './AddFiles.jsx'
import withIpfs from './IpfsContainer.jsx'

const addFilesHoc = (Component) => (
  class AddFilesContainer extends preact.Component {
    constructor (props) {
      super(props)
      this.nextId = 0
      this.state = {
        files: [],
        ipfsRefMap: {},
        rootNode: null
      }
    }

    addFiles = (evt) => {
      evt.preventDefault()
      evt.stopPropagation()

      const fileList = evt && evt.target && evt.target.files
      console.log('adding', fileList)
      if (!fileList) return

      const files = []
      for (let fileRef of fileList) {
        fileRef.id = this.nextId++
        files.push(fileRef)
      }
      this.setState(state => {
        return {
          files: state.files.concat(files)
        }
      })
      window.setTimeout(() => this.addFilesToIpfs(files), 500)
    }

    addFilesToIpfs = async (files) => {
      for (let file of files) {
        const ipfsRef = await this.addFileToIpfs(file)
        this.setState(s => {
          const ipfsRefMap = Object.assign({}, s.ipfsRefMap)
          ipfsRefMap[file.id] = ipfsRef
          return {ipfsRefMap}
        })
      }
    }

    addFileToIpfs = async (file) => {
      const content = await this.fileToBuffer(file)
      const [ipfsRef] = await this.props.ipfs.files.add(content)
      return ipfsRef
    }

    fileToBuffer (file) {
      return new Promise((resolve, reject) => {
        let reader = new window.FileReader()
        reader.onerror = reject
        reader.onloadend = () => {
           resolve(Buffer.from(reader.result))
        }
        reader.readAsArrayBuffer(file)
      })
    }

    removeFile = (file) => {
      this.setState(state => {
        const files = state.files.filter(f => f.id !== file.id)
        const ipfsRefMap = Object.assign({}, state.ipfsRefMap)
        delete ipfsRefMap[file.id]
        return { files, ipfsRefMap }
      })
    }

    shareFiles = async () => {
      try {
        const rootNode = await this.shareViaDagApi()
        this.prefetchAtGateway(rootNode)
        this.setState({rootNode})
      } catch (err) {
        return console.log(err)
      }
    }

    shareViaDagApi = async () => {
      const {ipfs} = this.props
      const {files, ipfsRefMap} = this.state

      let rootNode = await ipfs.object.new('unixfs-dir')

      for (let file of files) {
        const ipfsRef = ipfsRefMap[file.id]
        const link = {
          name: file.name,
          size: ipfsRef.size,
          multihash: ipfsRef.hash
        }
        // update rootNode as we add a link for each file.
        rootNode = await ipfs.object.patch.addLink(rootNode.toJSON().multihash, link)
      }

      // All links added. The hash for the rootNode is the address for our batch of files.
      return rootNode.toJSON()
    }

    // Peer all the things.
    async prefetchAtGateway (rootNode) {
      const url = `https://ipfs.io/ipfs/${rootNode.multihash}`
      return window.fetch(url, {
        method: 'HEAD'
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Gateway response was not ok')
          } else {
            console.log('Prefetched', url)
          }
        }).catch((err) => {
          console.log('Failed to pre-fetch snapshot', url, err)
        })
    }

    render (props, {files, ipfsRefMap, rootNode}) {
      // merge file info and ipfs info (where available)
      const fileRefs = files.map(({id, name, size, type}) => {
        const fileRef = {id, name, size, type}
        const ipfsRef = ipfsRefMap[id]
        if (ipfsRef) {
          fileRef.multihash = ipfsRef.hash
        }
        return fileRef
      })
      const canShare = fileRefs.length > 0 && fileRefs.every(f => !!f.multihash)
      return (
        <Component
          fileRefs={fileRefs}
          canShare={canShare}
          rootNode={rootNode}
          onAddFiles={this.addFiles}
          onRemoveFile={this.removeFile}
          onShare={this.shareFiles} />
      )
    }
  }
)

export default withIpfs(addFilesHoc(AddFiles))
