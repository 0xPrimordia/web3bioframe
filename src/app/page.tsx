// ./app/page.tsx
//https://api.crawlbase.com/screenshots?token=4HrVHd6RoiajGYYEJsx0QA&height=700&url=https://web3.bio/$%7BlastFramerUsername%7D
import { getAddressForFid, FrameActionPayload } from "frames.js"
import { useEffect, useState } from "react";
import {
  getInsecureHubRpcClient,
  getSSLHubRpcClient,
} from "@farcaster/hub-nodejs";
import { FrameContainer, FrameImage, FrameButton, useFramesReducer, getPreviousFrame, validateActionSignature, FrameInput } from "frames.js/next/server";

export const hubClient =
  process.env.HUB_USE_TLS && process.env.HUB_USE_TLS !== "false"
    ? getSSLHubRpcClient(process.env.HUB_URL!)
    : getInsecureHubRpcClient(process.env.HUB_URL!);

const reducer = (state:any, action:any) => ({ count: state.count + 1 });
 
export default async function Home(props:any) {
  const previousFrame = getPreviousFrame(props.searchParams);
  const validMessage = await validateActionSignature(previousFrame.postBody);
  const [useAddress, setAddress] = useState()
  const [state, dispatch] = useFramesReducer(reducer, { count: 0 }, previousFrame);
  const framesrc = `https://api.crawlbase.com/screenshots?token=${process.env.CRAWLBASE_ID}&height=700&width=366&url=https://web3.bio/$%7BlastFramerUsername%7D`
 
  useEffect(() => {
    getAddress()
    
  })

  const getAddress = async () => {
    const fid = validMessage?.data.frameActionBody.castId?.fid
    if(!fid) return 
    const address = await getAddressForFid({
      fid: fid,
      hubClient,
    });
    return address
  }

  return (
    <FrameContainer postUrl="/frames" state={state} previousFrame={previousFrame}>
      <FrameImage src={framesrc} />
      <FrameButton onClick={dispatch}>
        {state.count}
      </FrameButton>
    </FrameContainer>
  );
}