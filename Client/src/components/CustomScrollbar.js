import React, {forwardRef, useCallback} from "react";
import { Scrollbars } from "react-custom-scrollbars";

const CustomScrollbarsVirtualList = ({ onScroll, forwardedRef, style, children }) => {
    const refSetter = useCallback(scrollbarsRef => {
        if (scrollbarsRef) {
            forwardedRef(scrollbarsRef.view);          
        } 
        else {
            forwardedRef(null);
        }
    }, [forwardedRef]);
  
    return (
        <Scrollbars
            ref={refSetter}
            style={{ ...style, overflow: "hidden" }}
            onScroll={onScroll}
        >
            {children}
        </Scrollbars>
    );
};

const CustomScrollbar = ((props, ref) => {
    return (
        <CustomScrollbarsVirtualList {...props} forwardedRef={ref}/>
    )
});

export default forwardRef(CustomScrollbar);