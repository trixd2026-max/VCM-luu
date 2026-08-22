import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as cn } from "./router-CmyOnWoO.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md bg-card px-3 text-base text-foreground shadow-[0_0_0_1px_rgba(28,38,31,0.14)] outline-none transition-[box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:shadow-[0_0_0_2px_rgba(44,83,64,0.45)] disabled:opacity-50 md:text-sm", className),
		...props
	});
}
//#endregion
export { Input as t };
