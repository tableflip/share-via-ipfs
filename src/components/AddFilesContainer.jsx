import preact from 'preact'
import getIpfs from 'window.ipfs-fallback'
import fileReaderStream from 'filereader-stream'

import AddFiles from './AddFiles.jsx'
import GetFiles from './GetFiles.jsx'

const addFilesHoc = (Component) => (
  class AddFilesContainer extends preact.Component {

    state = {
      fileRefs: [],
      ipfsPathMap: {},
      shareStatus: null,
      ipfsStatus: 'connecting'
    }

    ipfs = null

    async componentWillMount () {
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
    }

    addFiles = (evt) => {
      evt.preventDefault()
      evt.stopPropagation()

      const fileList = evt && evt.target && evt.target.files
      console.log(fileList)
      if (!fileList) return

      const fileRefs = []
      for (let file of fileList) { // fileList is not array
        fileRefs.push(file)
      }
      this.setState(state => {
        return {
          fileRefs: state.fileRefs.concat(fileRefs)
        }
      })
      this.addFilesToIpfs(fileRefs)
    }

    addFilesToIpfs = async (fileRefs) => {
      // build up a map of path to ipfsRef as they are added.
      // { "my.jpeg": { path: "/my.jpeg", hash: "QmHash"} ... }
      const ipfsPathMap = {}

      for (let fileRef of fileRefs) {
        // const path = `/${fileRef.name}`
        const content = await this.fileToBuffer(fileRef)
        const [ipfsRef] = await this.ipfs.files.add(content)

        console.log(fileRef.name, ipfsRef)

        ipfsPathMap[fileRef.name] = ipfsRef
      }

      this.setState(state => {
        return {
          ipfsPathMap: Object.assign({}, state.ipfsPathMap, ipfsPathMap)
        }
      })
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
        const fileRefs = state.fileRefs.filter(f => f !== file)
        const ipfsPathMap = Object.assign({}, state.ipfsPathMap)
        delete ipfsPathMap[file.name]
        return { fileRefs, ipfsPathMap }
      })
    }

    // Copy the hashes into a new shared directory, return stat of dir. Use hash as share link.
    shareFiles = async () => {
      const filenames = Object.keys(this.state.ipfsPathMap)
      // const dir = new Date().toISOString().replace(/[:\.]/g, '-')
      // const prefix = `/shared/${dir}`
      try {
        const shareStatus = await this.shareViaDagApi(filenames, this.state.ipfsPathMap)
        // await this.ipfs.files.mkdir(prefix, {parents: true})
        // const shareStatus = await this.ipfs.files.stat(prefix)
        this.setState({shareStatus})

      } catch (err) {
        return console.log(err)
      }
    }

    shareViaDagApi = async (filenames, ipfsPathMap) => {
      // update rootNode as we add a link to each file.
      let rootNode = await this.ipfs.object.new('unixfs-dir')

      for (let filename of filenames) {
        const ipfsRef = this.state.ipfsPathMap[filename]
        const link = {
          name: filename,
          size: ipfsRef.size,
          multihash: ipfsRef.hash
        }
        rootNode = await this.ipfs.object.patch.addLink(rootNode.toJSON().multihash, link)
      }
      console.log('rootNode', rootNode.toJSON())
      // All links added. The hash for the rootNode is the address for our batch of files.
      return {
        hash: rootNode.toJSON().multihash,
        node: rootNode.toJSON()
      }
    }

    render (props, {fileRefs, ipfsPathMap, shareStatus}) {
      return (
        <Component
          fileRefs={fileRefs}
          ipfsPathMap={ipfsPathMap}
          shareStatus={shareStatus}
          onAddFiles={this.addFiles}
          onRemoveFile={this.removeFile}
          onShare={this.shareFiles} />
      )
    }
  }
)

export default addFilesHoc(AddFiles)
