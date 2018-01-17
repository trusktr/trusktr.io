
export
function getUserAudio() {
    let resolve, reject
    const promise = new Promise((res, rej) => {resolve = res; reject = rej})

    navigator.getUserMedia (
        { audio: true },
        stream => resolve(stream),
        err => reject(err),
    )

    return promise
}

// borrowed from codepen.io/gapcode/pen/vEJNZN
export
function detectIE() {
  var ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
  
  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
  
  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
  
  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

export
function showNeedsBetterBrowser() {
    document.body.innerHTML = `
        <style>
            body, html { width:100%; height:100%;
                background: #222; color: #E38DA7; }
            div { text-align: center }
            h1 { font-size: 42px }
            a { color: blue }
        </style>
        <div>
            <h1> :( </h1>
            <h2> You need a better web browser to view my site.  </h2>
            <p>
                I recommend <a href="https://www.google.com/chrome">Chrome</a> or <a href="https://firefox.com">Firefox</a>.
            </p>
        </div>
    `

    var links = document.getElementsByTagName('a')

    setInterval(function() {
        for (var l=links.length, i=0; i<l; i+=1) {
            var color = 'rgb('+
                Math.round(Math.random() * 255) +', '+
                Math.round(Math.random() * 255) +', '+
                Math.round(Math.random() * 255)
            +')'
            links[i].style.color = color
        }
    }, 0)
}
