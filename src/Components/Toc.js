import { useEffect, useRef, useState } from "react";
import TocItem from "./TocItem";

function Toc(props) {
  const tocRef = useRef();
  const [tocItems, setTocItems] = useState([]);

  useEffect(() => {
    var spineByHref, prev, previous_link;
    const items = [];
    // not sure if this is safe
    const tempPagesDict = {};

    var generateTocItems = function(toc, level) {
      if (!level) level = 0;
  
      toc.forEach(function(chapter) {
        if (previous_link)
          tempPagesDict[previous_link.key] = spineByHref[chapter.href.split("#")[0]] - prev;
        prev = spineByHref[chapter.href.split("#")[0]];

        var link = <TocItem 
                      pagesDict={tempPagesDict} 
                      level={level} 
                      key={chapter.id} 
                      chapterId={chapter.id} 
                      chapterLink={chapter.href} 
                      chapterName={chapter.label} 
                      setLocation={props.setLocation}
                    />;
  
        items.push(link);
        previous_link = link;
  
        if (chapter.subitems && chapter.subitems.length > 0)
          generateTocItems(chapter.subitems, level + 1);
      });
  
      return items;
    };

    if (props.toc && props.spine) {
      spineByHref = props.spine.spineByHref;
      setTocItems(generateTocItems(props.toc, 0));
      if (!prev) prev = 0;
      if (previous_link)
        tempPagesDict[previous_link.key] = props.spine.length - prev;
    }
  }, [props.toc, props.spine, props.setLocation])

  return (
    <div className="readerTocInner" ref={tocRef}>{tocItems}</div>
  )
}

export default Toc;