import { Button } from "@nextui-org/button";
import HSplitter from "../HSplitter";

export default function Home() {
    return (
        <HSplitter>
            <div slot="left">
                왼쪽
            </div>
            <div slot="right">오른쪽</div>
        </HSplitter>

    );
}
