function gameopener(url) {
    var win = window.open();
    var iframe = win.document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "0";
    iframe.style.top = "0";
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.margin = "0";
    iframe.style.padding = "0";
    iframe.src = `${
        window.location.origin
    }/uv/service/${Ultraviolet.codec.xor.encode(url)}`;
    win.document.body.appendChild(iframe);
    win.document.body.style.overflow = "hidden";
}        