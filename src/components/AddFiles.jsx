import preact from 'preact'
import FileItem from './FileItem.jsx'

export default class AddFiles extends preact.Component {
  render ({fileRefs, canShare, rootNode, onAddFiles, onRemoveFile, onShare}) {
    return (
      <section className='db mw6 ba b--gray bg-white avenir br2'>
        <h1 className='ma0 ph3 pv4 f4 fw5 navy'>
          Share files via <a native className='link blue' href='http://ipfs.io'>IPFS</a>
        </h1>
        <label for='add-files' className='db pa3 link glow o-90 bg-blue white relative'>
          <span class='dib v-bottom mr2 bg-white blue tc' style={{width: '20px', height: '20px', borderRadius: '30px', lineHeight: '20px'}}>+</span>
          <span>Click to add files</span>
          <input id='add-files' className='o-0 absolute top-0' type='file' onChange={onAddFiles} multiple />
        </label>
        <div>
          {fileRefs.length === 0 ? null : (
            <div className='pl3 pv2 f6 silver bg-light-gray'>added so far...</div>
          )}
          {fileRefs.map((fileRef) => {
            return (
              <FileItem fileRef={fileRef}>
                {rootNode ? null : (
                  <div
                    style={{width: '20px'}}
                    className='dtc f4 red v-mid glow pointer pa2'
                    onClick={() => onRemoveFile(fileRef)}>×</div>
                )}
              </FileItem>
            )
          })}
          {!canShare ? null : (
            <div className='bt b--light-gray bg-near-white tc'>
              {rootNode ? (
                <label className='db w-90 center pt3 pb4'>
                  <span className='db f6 tl pl2 pb2'>
                    Share link
                  </span>
                  <input
                    type='url'
                    value={window.location + rootNode.multihash}
                    className='db pl2 pv2 bn f7 w-100 avenir input-reset' />
                </label>
              ) : (
                <div className='pv4'>
                  <button className='button-reset pointer ba b--blue bg-blue ph4 pv2 br2 white f5 fw4 avenir' onClick={onShare}>
                    Get share link
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    )
  }
}
