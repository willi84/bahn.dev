import { ParseLogs } from '../parse-logs/parse-logs';
import { getChildren, getFirstKey } from '../parse-utils/parse-utils';

export const getFrameRef = (json: any, searched: string, logs: ParseLogs) => {
    let result: any = {};
    const keys = Object.keys(json);
    // const compositeFrame = getPartOfJSON(json, 'metadata');
    // TODO: standar json getting, standard child getting
    const children = getChildren(json, keys);
    for(const child of children){
        const key = getFirstKey(child);
        switch(key){
            case 'frames':
                const frames = child[key].children;
                let hasFrame = false;
                for(const frame of frames){
                    const frameKey = getFirstKey(frame);
                    if(frameKey === searched) {
                        hasFrame = true;
                        result = frame[frameKey]
                    }
                }
                if(!hasFrame){
                    logs.addError(`Frame not found in metadata`, { searched, availableFrames: frames.map((f: any) => getFirstKey(f)) });
                }
        }
    }
    return result;
};

export const getPartOfJSON = (json: any, part: string) => {
    const base = json.PublicationDelivery.children[2].dataObjects.children[0];
    switch (part) {
        case 'stops':
            return (
                base.CompositeFrame.children[3].frames.children[0].SiteFrame ||
                {}
            );
        case 'metadata':
            return base.CompositeFrame;
        case 'ressources':
            return base;
        default:
            return {};
    }
};