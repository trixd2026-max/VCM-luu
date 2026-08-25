import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { x as cn } from "./router-8HaLVA_X.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-lg bg-card px-3 py-2.5 text-base text-foreground shadow-[0_0_0_1px_rgba(28,38,31,0.14)] outline-none transition-[box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:shadow-[0_0_0_2px_rgba(44,83,64,0.45)] disabled:opacity-50 md:text-sm", className),
		...props
	});
}
//#endregion
export { Textarea as t };
