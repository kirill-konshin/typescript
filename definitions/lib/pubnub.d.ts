declare module PUBNUB {

    export class ws {

        constructor(url:string);

        onmessage;
        onclose;
        onerror;
        onopen;
        CLOSE_NORMAL:string;
        pubnub:{
            ready();
        };

        close(type:string, message:string);

    }

}