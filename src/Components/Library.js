import Reader from './Reader';
import useLocalStorage from './useLocalStorage';

function Library(props) {
  const [book1, setBook1] = useLocalStorage("book1", "");
  const [leftLocation, setLeftLocation] = useLocalStorage("leftLocation", null);
  const [book2, setBook2] = useLocalStorage("book2", "");
  const [rightLocation, setRightLocation] = useLocalStorage("rightLocation", null);

  const [notes, setNotes] = useLocalStorage("notes", "");

  const [reading, setReading] = useLocalStorage("reading", false);

  return (
    <div>
      {!reading ?
        <div>
          <p>Instructions:</p>
          <p>Place your unzipped ebooks in the "public" directory. Set the fields below to the content.opf files inside the ebooks.</p>
          <form onSubmit={e => {e.preventDefault(); setLeftLocation(null); setRightLocation(null); setReading(true)}}>
            <p>Book 1 (foreign):</p>
            /public/<input style={{"width": "500px"}} autoComplete="on" value={book1} onChange={e => setBook1(e.target.value)} placeholder="foreign/path/to/content.opf" />
            <p>Book 2 (english):</p>
            /public/<input style={{"width": "500px"}} autoComplete="on" value={book2} onChange={e => setBook2(e.target.value)} placeholder="english/path/to/content.opf" />
            <br />
            <br />
            <button type="submit" disabled={!book1 || !book2}>Read</button>
          </form>
          <br />
          <p>Notes that persist on reload, write whatever you want here (such as .opf file locations):</p>
          <textarea cols="100" rows="20" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      :
        <Reader 
          url1={book1} 
          leftLocation={leftLocation} 
          setLeftLocation={setLeftLocation} 
          url2={book2} 
          rightLocation={rightLocation}
          setRightLocation={setRightLocation}
          category="latin" 
          setReading={setReading} 
        />
      }
    </div>
  )
}

export default Library;