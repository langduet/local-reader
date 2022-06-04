import '../CSS/Reader.css';
import { EpubView } from 'react-reader';
import { useRef, useState, useEffect } from 'react';
import arrowBackIcon from "../Icons/arrow_back.svg"
import chevronLeftIcon from "../Icons/chevron_left.svg"
import menuIcon from "../Icons/menu.svg"
import arrowForwardIcon from "../Icons/arrow_forward.svg"
import textFormatIcon from "../Icons/text_format.svg"
import Toc from './Toc';

function Reader(props) {
  const draggableReaderRef = useRef(null);
  const leftRef = useRef(null);
  const leftRenditionRef = useRef(null);
  const rightRef = useRef(null);
  const rightRenditionRef = useRef(null);

  const [tocShow, setTocShow] = useState(false);
  const [leftToc, setLeftToc] = useState([]);
  const [rightToc, setRightToc] = useState([]);
  
  const [blur, setBlur] = useState(false);

  const tabFunction = e => {
    if (e.key === "Tab") {
      e.preventDefault();
      setBlur(current => !current);
    }
  }

  const clickFunction = e => {
    if (!(e.target.classList.contains("tocIcon") ||
          e.target.classList.contains("readerTocInner") ||
          e.target.classList.contains("readerTocOuter") ||
          e.target.classList.contains("tocLink") ||
          e.target.classList.contains("tocElement")))
      setTocShow(false);
    if (!(e.target.id === "fontIcon" ||
          e.target.classList.contains("topRightTooltip") ||
          e.target.classList.contains("fontLine") ||
          e.target.classList.contains("fontLabelText") ||
          e.target.classList.contains("fontInput")))
      setFontShow(false);
  }

  const arrowFunction = e => {
    if (e.key === "ArrowRight") {
      leftRef.current.nextPage()
      rightRef.current.nextPage()
    }
    if (e.key === "ArrowLeft") {
      leftRef.current.prevPage()
      rightRef.current.prevPage()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', tabFunction)
    document.addEventListener('click', clickFunction)
  }, [])

  useEffect(() => {
    if (rightRenditionRef.current) {
      rightRenditionRef.current.themes.select(blur ? "blur" : 'custom');
      var location = rightRenditionRef.current.location.start.cfi;
      rightRenditionRef.current.clear();
      rightRenditionRef.current.display(location);
    }
  }, [blur]);
  
  const [iconShow, setIconShow] = useState(false);
  const [iconTooltipText, setIconTooltipText] = useState("");
  const [iconTooltipKeyText, setIconTooltipKeyText] = useState("");

  const [fontShow, setFontShow] = useState(false);
  const [font, setFont] = useState('Times');
  const fontOptions = [
    { label: 'Times New Roman', value: 'Times' },
    { label: 'Sans-Serif', value: 'sans-serif' },
    { label: 'Garamond', value: 'Garamond' },
  ];
  const handleFontChange = (event) => {
    setFont(event.target.value);
  };
  useEffect(() => {
    if (rightRenditionRef.current)
      rightRenditionRef.current.themes.font(font);
    if (leftRenditionRef.current)
      leftRenditionRef.current.themes.font(font);
  }, [font]);
  
  const [fontSize, setFontSize] = useState(16);
  const handleFontSizeChange = (event) => {
    setFontSize(event.target.value);
  };

  const iconMouseOver = e => {
    if (fontShow) return;
    switch (e.target.id) {
      case "fontIcon":
        setIconTooltipText("Font settings");
        setIconTooltipKeyText("");
        setIconShow(true);
        break;
      default:
        setIconShow(false);
    }
  }
  
  const iconMouseOut = e => {
    setIconShow(false);
  }

  return (
    <div className="mainPage">
      <div className="splitReader left">
        <div>
          <EpubView
            ref={leftRef}
            url={props.url1}
            epubOptions={{
              flow: "scrolled-doc",
            }}
            getRendition={(rendition) => {
              leftRenditionRef.current = rendition;
              rendition.themes.register('custom', {
                body: {
                  margin: 0
                }
              })
              rendition.themes.select('custom')
              rendition.themes.fontSize(`16`)
              rendition.on("rendered", (e,i) => {;
                i.document.documentElement.addEventListener('keydown', tabFunction)
                i.document.documentElement.addEventListener('click', clickFunction)
              });
            }}
            tocChanged={setLeftToc}
            handleKeyPress={arrowFunction}
            location={props.leftLocation}
            locationChanged={props.setLeftLocation}
          />
        </div>
      </div>
      <div className="splitReader right">
      <div ref={draggableReaderRef}>
        <EpubView
          ref={rightRef}
          url={props.url2}
          epubOptions={{
            flow: "scrolled-doc",
          }}
          getRendition={(rendition) => {
            rightRenditionRef.current = rendition;
            rendition.themes.register('custom', {
              body: {
                margin: 0,
                fontFamily: "sans-serif"
              }
            })
            rendition.themes.register('blur', {
              body: {
                margin: 0,
                filter: "blur(4px)"
              }
            })
            rendition.themes.select(blur ? "blur" : 'custom')
            rendition.themes.fontSize(`16`)
            rendition.on("rendered", (e,i) => {;
              i.document.documentElement.addEventListener('keydown', tabFunction)
              i.document.documentElement.addEventListener('click', clickFunction)
            });
          }}
          tocChanged={setRightToc}
          handleKeyPress={arrowFunction}
          location={props.rightLocation}
          locationChanged={props.setRightLocation}
        />
      </div>
      </div>
      <div className={"readerHideable readerTop"}>
        <div className={(tocShow ? "" : "disabled ") + "readerTocOuter left"}>
          <div className="readerTocInner">
            <Toc toc={leftToc} spine={leftRef.current?.book?.spine} setLocation={props.setLeftLocation} />
          </div>
        </div>
        <div className={(tocShow ? "" : "disabled ") + "readerTocOuter right"}>
          <div className="readerTocInner">
            <Toc toc={rightToc} spine={rightRef.current?.book?.spine} setLocation={props.setRightLocation} />
          </div>
        </div>
        <div className="readerControls top left">
          <span onClick={() => props.setReading(false)} className="readerControlsText">
            <img src={chevronLeftIcon} alt="TOC" className="readerControlsTextIcon" />
            <span>Library</span>
          </span>
        </div>
        <div className="readerControlsFlex top right">
          <img 
            onMouseOver={iconMouseOver} 
            onMouseOut={iconMouseOut} onClick={() => {setIconShow(false); setFontShow(p => !p)}} 
            className={(fontShow ? "selected " : "") + "readerControlsIcon"} 
            src={textFormatIcon} 
            alt="TOC" 
            id="fontIcon" 
          />
        </div>
        <div className={(iconShow && !tocShow ? "" : "disabled ") + "topRightTooltip"}>
          {iconTooltipText}
          <div className={(iconTooltipKeyText ? "tooltipKey" : "disabled")}><em>{iconTooltipKeyText}</em></div>
        </div>
        <div className={(fontShow ? "" : "disabled ") + "topRightTooltip"}>
          <div className="fontLabelText">Font: </div>
          <select className="fontInput" value={font} onChange={handleFontChange}>
            {fontOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <div className="fontLine" />
          <div className="fontLabelText">Font Size: </div>
          <input className="fontInput" value={fontSize} onChange={handleFontSizeChange} type="number" name="fontSize" min="1" max="72" />
        </div>
      </div>
      <div className={"readerHideable readerBottom"}>
        <div className="readerControls bottom left">
          <img onClick={() => leftRef.current.prevPage()} src={arrowBackIcon} alt="TOC" className="readerControlsIcon" />
          <img onClick={() => setTocShow(p => !p)} src={menuIcon} alt="TOC" className={(tocShow ? "selected " : "") + "readerControlsIcon tocIcon"} />
          <img onClick={() => leftRef.current.nextPage()} src={arrowForwardIcon} alt="TOC" className="readerControlsIcon" />
        </div>
        <div className="readerControls bottom center">
          <img onClick={() => {leftRef.current.prevPage(); rightRef.current.prevPage()}} src={arrowBackIcon} alt="TOC" className="readerControlsIcon" />
          <img onClick={() => {leftRef.current.nextPage(); rightRef.current.nextPage()}} src={arrowForwardIcon} alt="TOC" className="readerControlsIcon" />
        </div>
        <div className="readerControls bottom right">
          <img onClick={() => rightRef.current.prevPage()} src={arrowBackIcon} alt="TOC" className="readerControlsIcon" />
          <img onClick={() => setTocShow(p => !p)} src={menuIcon} alt="TOC" className={(tocShow ? "selected " : "") + "readerControlsIcon tocIcon"} />
          <img onClick={() => rightRef.current.nextPage()} src={arrowForwardIcon} alt="TOC" className="readerControlsIcon" />
        </div>
      </div>
    </div>
  );
}

export default Reader;