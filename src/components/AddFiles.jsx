import preact from 'preact'
import FileItem from './FileItem.jsx'
import LoadingMsg from './Loading.jsx'

export default class AddFiles extends preact.Component {
  render ({fileRefs, canShare, rootNode, onAddFiles, onRemoveFile, onShare}) {
    return (
      <section className='db mw6 ba b--gray bg-white avenir br2'>
        <h1 className='ma0 ph3 pv4 f4 fw5 navy'>
          Share files via <a native className='link blue' href='http://ipfs.io'>IPFS</a>
        </h1>
        <label for='add-files' className='db pa3 link pointer glow o-90 bg-blue white relative'>
          <span class='dib v-bottom mr2 bg-white blue tc' style={{width: '20px', height: '20px', borderRadius: '30px', lineHeight: '20px'}}>+</span>
          <span>Click to add files</span>
          <input id='add-files' className='o-0 absolute top-0' type='file' onChange={onAddFiles} multiple />
        </label>
        <div>
          {canShare && fileRefs.length > 0 ? (
            <div className='pl3 pv2 f6 silver bg-light-gray'>added so far...</div>
          ) : null }
          {!canShare && fileRefs.length > 0 ? (
            <div className='pl3 pv2 f6 silver bg-light-gray'>your files are being added to IPFS</div>
          ) : null }
          {fileRefs.map((fileRef) => {
            return (
              <FileItem fileRef={fileRef}>
                {rootNode ? null : (
                  <div
                    style={{width: '20px'}}
                    className='dtc f4 red v-mid glow pointer pa1'
                    onClick={() => onRemoveFile(fileRef)}>×</div>
                )}
              </FileItem>
            )
          })}
          {fileRefs.length > 0 ? (
            <div className='bt b--light-gray bg-near-white tc'>
              {!canShare ? (
                <LoadingMsg />
              ) : null }

              {canShare && rootNode ? (
                <label className='db pt3 pb4'>
                  <div className='w-90 center'>
                    <span className='db f5 tl pt1 pl2 pb2'>
                      Share link
                    </span>
                    <input
                      type='url'
                      value={window.location + (rootNode.multihash || rootNode.hash)}
                      className='db pl2 pv2 bn f7 w-100 avenir navy input-reset' />
                  </div>
                </label>
              ) : null }

              {canShare && !rootNode ? (
                <div className='pv4'>
                  <button className='button-reset pointer ba b--blue bg-blue ph4 pv2 br2 white f5 fw4 avenir' onClick={onShare}>
                    Get share link
                  </button>
                </div>
              ) : null }
            </div>
          ) : null}
        </div>
      </section>
    )
  }
}
