import ReactDOM from "react-dom/client";
import StorageContext from "@/Context/Storage";
import View from "@Page/View";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<StorageContext>
		<View />
	</StorageContext>
);
