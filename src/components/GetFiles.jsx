import preact from 'preact'
import filesize from 'filesize'

import FileItem from './FileItem.jsx'
import LoadingMsg from './Loading.jsx'

const humansize = filesize.partial({round: 0})

export default class GetFiles extends preact.Component {

  downloadAll = () => {
    const {rootNode} = this.props
    if (!rootNode) return
    rootNode.links.forEach((dagLink, i) => {
      const el = document.getElementById(dagLink.multihash)
      // Without the timeout, chrome will only download the last item.
      window.setTimeout(() => el.click(), (i+1) * 200)
    })
  }

  render ({rootNode, ipfsState}) {
    return !rootNode ? (
      <section className='db mw6 pv5 tc white f3 avenir br2 bg-black-50' >
        <LoadingMsg ipfsState={ipfsState} />
      </section>
    ) : (
      <section className='db mw6 ba b--light-gray bg-white avenir br2'>
        <h1 className='ma0 ph3 pv4 f4 fw5 navy'>
          Get files via <a native className='link blue' href='http://ipfs.io'>IPFS</a>
        </h1>
        <div>
          <div className='pl3 pv2 f6 silver bg-light-gray'>
            {rootNode.links.length} files - {humansize(rootNode.size)}
          </div>
          {!rootNode ? null : rootNode.links.map((dagLink) => (
            <FileItem fileRef={dagLink} ipfsRef={dagLink}>
              <a
                native
                id={dagLink.multihash}
                download={dagLink.name}
                href={`/ipfs/${dagLink.multihash}`}
                className='dtc f4 green v-mid glow pointer pa1' style={{width: '30px'}}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16'>
                  <path d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z ' />
                </svg>
              </a>
            </FileItem>
            ))}
            <div className='pv4 bt b--light-gray bg-near-white tc'>
              <button
                onClick={this.downloadAll}
                className='link pointer glow o-90 ba b--green bg-green ph4 pv2 br2 white f5 fw4 avenir' >
                Download all
              </button>
            </div>
        </div>
      </section>
    )
  }
}
