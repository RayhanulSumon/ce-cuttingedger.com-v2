import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import "react";
import { useForm } from "@inertiajs/react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Login.tsx
function Login() {
	const { data, setData, post, processing, errors } = useForm({
		email: "",
		password: "",
		remember: false
	});
	const submit = (e) => {
		e.preventDefault();
		post(route("admin.login.submit"));
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SeoHead, { title: "Ops Portal Clearance — Sign In" }), /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#08090c] text-white flex items-center justify-center p-4 selection:bg-accent selection:text-black",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md relative z-10 space-y-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center space-y-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent text-black font-black text-xl font-mono shadow-xl shadow-accent/10",
						children: "CE"
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-accent block",
						children: "[ STUDIO OPERATIONS // RESTRICTED ACCESS ]"
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-display font-extrabold text-white tracking-tight mt-1",
						children: "Command Clearance."
					})] })]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "p-8 rounded-3xl bg-[#0f1118] border border-white/10 shadow-2xl space-y-6",
					children: /* @__PURE__ */ jsxs("form", {
						onSubmit: submit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5 text-neutral-500" }), /* @__PURE__ */ jsx("span", { children: "Clearance ID / Email" })]
									}),
									/* @__PURE__ */ jsx(Input, {
										type: "email",
										name: "email",
										value: data.email,
										onChange: (e) => setData("email", e.target.value),
										placeholder: "admin@cuttingedger.com",
										required: true,
										autoFocus: true,
										className: "bg-[#161922] border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-accent"
									}),
									errors.email && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-rose-400 font-mono",
										children: errors.email
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Lock, { className: "w-3.5 h-3.5 text-neutral-500" }), /* @__PURE__ */ jsx("span", { children: "Master Passcode" })]
									}),
									/* @__PURE__ */ jsx(Input, {
										type: "password",
										name: "password",
										value: data.password,
										onChange: (e) => setData("password", e.target.value),
										placeholder: "••••••••••••",
										required: true,
										className: "bg-[#161922] border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-accent"
									}),
									errors.password && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-rose-400 font-mono",
										children: errors.password
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-between text-xs pt-1",
								children: /* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-white transition-colors",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: data.remember,
										onChange: (e) => setData("remember", e.target.checked),
										className: "rounded border-white/20 bg-[#161922] text-accent focus:ring-0 focus:ring-offset-0 cursor-pointer"
									}), /* @__PURE__ */ jsx("span", { children: "Maintain Session" })]
								})
							}),
							/* @__PURE__ */ jsxs(Button, {
								type: "submit",
								disabled: processing,
								className: "w-full h-11 bg-accent hover:bg-[#bde600] text-black font-semibold text-sm rounded-xl gap-2 mt-4",
								children: [/* @__PURE__ */ jsx("span", { children: processing ? "Authenticating..." : "Authorize Access" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
							})
						]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-center",
					children: /* @__PURE__ */ jsx("span", {
						className: "text-[11px] font-mono text-neutral-500",
						children: "SECURED BY CUTTING EDGER OPS ENGINE"
					})
				})
			]
		})]
	})] });
}
Login.layout = (page) => page;
//#endregion
export { Login as default };
