import type { Metadata } from "next";
import Link from "next/link";
import Form from "next/form";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { getDbSession } from "@/lib/auth/session";
import { getUserById } from "@/db/repo/usersRepo";
import { ToastProvider } from "@/components/ToastProvider";
import { redirect } from "next/navigation";
import { destroyDbSession } from "@/lib/auth/session";

const poppins = Poppins({
	subsets: ["latin"],
	variable: "--font-poppins",
	weight: ["300", "400", "600", "700"],
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Evently - Expense Sharing App",
	description:
		"A simple and intuitive expense sharing app to help you manage group expenses with ease.",
};

export async function Logout() {
	"use server";

	await destroyDbSession();
	// destroy the session for the logged in user

	redirect("/");
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getDbSession();
	const userId = session?.userId;
	const user = userId ? await getUserById(userId) : null;

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
			>
				<nav>
					<input type="checkbox" id="nav-toggle" />

					<label htmlFor="nav-toggle" className="nav-toggle-label">
						☰ Menu
					</label>

					<ul className="nav-menu">
						<li className="nav-left">
							<Link href="/">Home</Link>
						</li>

						<div className="nav-right">
							{user ? (
								<>
									<li>
										<Link href="/user/dashboard">
											Dashboard
										</Link>
									</li>
									<li>
										<Link href="/user/payments">
											Payments
										</Link>
									</li>
									<li>
										<Form
											action={Logout}
											className="logout-form"
										>
											<button
												type="submit"
												className="logout-button"
											>
												Logout
											</button>
										</Form>
									</li>
								</>
							) : (
								<li>
									<Link href="/login">Login</Link>
								</li>
							)}
						</div>
					</ul>
				</nav>

				<ToastProvider>{children}</ToastProvider>

				<footer className="footer">
					<div className="footer-left">HÓPUR 1</div>

					<div className="footer-right">
						<p>VEFÞ3VÞ05DU</p>
						<p>Vorönn 2026</p>
						<p>Lokaverkefni</p>
					</div>
				</footer>
			</body>
		</html>
	);
}
