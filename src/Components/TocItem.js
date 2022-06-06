import "../CSS/Toc.css";

function TocItem(props) {
  return (
    <div className="tocElement" style={{paddingLeft: props.level * 12 + "px"}}>
      <span className={props.current ? "current tocLink" : "tocLink"} onClick={() => props.setLocation(props.chapterLink)}>{props.chapterName}</span>
      {props.chapterId in props.pagesDict && 
        props.pagesDict[props.chapterId] > 1 && 
        <span><i>({props.pagesDict[props.chapterId]} pages)</i></span>}
    </div>
  )
}

export default TocItem;