import { forwardRef, useRef } from "react"

export default forwardRef(({
    onStartTyping,
    onEndTyping,
    endAfterLastClickTime,
    onKeyDown,
    type = 'text',
    ...other
}, ref) => {
    const isTypintTimeoutRef = useRef(null)

    function onInputKeyPress(event) {
        onKeyDown?.(event)
        if(!isTypintTimeoutRef.current) {
            onStartTyping?.(event)
        } else {
            clearTimeout(isTypintTimeoutRef.current)
        }
        isTypintTimeoutRef.current = setTimeout(() => {
            isTypintTimeoutRef.current = null
            onEndTyping?.(event)
        }, endAfterLastClickTime)
    }

    return (
        <input ref={ref} type={type} onKeyDown={onInputKeyPress} {...other}/>
    )
})