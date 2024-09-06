import get from "lodash-es/get";

export const getStyleMarkup = css => {
    return `
    <style>
        ${css}
    </style>
`;
};

export const getMaxWidthMarkup = (maxWidth,body) => {
    if (maxWidth) {
        return `
    <table border="0" cellspacing="0" width="100%">
        <tr>
            <td></td>
            <td width="${maxWidth}">${body}</td>
            <td></td>
        </tr>
    </table>`;
    }
    return body;
};

export const getAlignMarkup = (options) => {
    let _align=get(options,'align','');
    let _content=get(options,'content','');
    let _width=get(options,'width','');

    let growLeft = '';
    let growRight = '';
    let width = _width ? ` width="${_width}"` : '';
    switch (_align) {
        case 'left': growRight = '<td></td>'; break;
        case 'right': growLeft = '<td></td>'; break;
        case 'center': growLeft = '<td></td>'; growRight = '<td></td>'; break;
        default:
            return body;
    }
    return `
    <table border="0" cellspacing="0" width="100%">
        <tr>
            ${growLeft}
            <td${width} style="padding-bottom: 10px">${_content}</td>
            ${growRight}
        </tr>
    </table>`;
};

export const htmlEmail = (options) => {

    var head=get(options,'head','');
    var css=get(options, 'css');
    var body=get(options,'body','');
    var maxWidth=get(options, 'maxWidth');

    body = getMaxWidthMarkup(maxWidth,body);
    let style = getStyleMarkup(css);

    let _htmlEmail =
       `
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            ${style}
            ${head}
        </head>
        <body>
        ${body}
        </body>
    </html>
`;

    return _htmlEmail;
}

export function sendEmail(options) {
    options = {
        from: '',
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        html: true,
        attachment: 'false',
        content: '',
        sendEmailURL: '',
        ...options,
    };
    if (!!options.to) {
//        let sendEmailURL = options.sendEmailURL; // <- This will be the code when more testing can be done.
        let sendEmailURL = '/insightweb/report/sendEmail';
        delete options.sendEmailURL;
        return fetch(sendEmailURL, {
                headers: new Headers({'Content-Type': 'application/json; charset=utf-8'}),
                method: 'POST',
                body: JSON.stringify(options),
            }
        ).then(function(response) {
//            console.log("response:",response.json());
            return response
        })
    }
}
