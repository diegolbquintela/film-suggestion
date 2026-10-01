import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-IWHfIGH2.mjs";
import { t as GROK_PROVIDERS } from "./server-BL0prBGb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-panel-BR_vSHhJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPanel() {
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	async function submitEmail(event) {
		event.preventDefault();
		if (pending) return;
		setPending(true);
		setError("");
		const body = {
			email: email.trim(),
			password,
			callbackURL: "/"
		};
		const result = mode === "up" ? await authClient.signUp.email({
			...body,
			name: email.trim().split("@")[0] || "Reader"
		}) : await authClient.signIn.email(body);
		setPending(false);
		if (result.error) setError(result.error.message || "That didn't sign you in.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl leading-none",
					children: "Tonight"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-normal text-muted",
					children: "Sign in so this phone and your computer keep the same shelf."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-3",
					children: [GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "min-h-11 w-full border border-line text-sm",
						onClick: () => signIn(provider.providerId, { callbackURL: "/" }),
						children: ["Continue with ", provider.label]
					}, provider.providerId)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "space-y-3 border-t border-line pt-4",
						onSubmit: submitEmail,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								autoComplete: "email",
								value: email,
								onChange: (event) => setEmail(event.target.value),
								placeholder: "Email",
								"aria-label": "Email",
								className: "min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								minLength: 8,
								autoComplete: mode === "up" ? "new-password" : "current-password",
								value: password,
								onChange: (event) => setPassword(event.target.value),
								placeholder: "Password",
								"aria-label": "Password",
								className: "min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: pending,
								className: "min-h-11 w-full bg-fg text-sm text-bg disabled:opacity-50",
								children: pending ? "One moment" : mode === "up" ? "Create account" : "Sign in with email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 w-full text-sm text-muted",
								onClick: () => {
									setMode(mode === "up" ? "in" : "up");
									setError("");
								},
								children: mode === "up" ? "I already have an account" : "Create an account"
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { LoginPanel as t };
