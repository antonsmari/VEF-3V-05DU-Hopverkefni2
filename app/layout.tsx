import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getDbSession } from "@/lib/auth/session";
import { getUserById } from "@/db/repo/usersRepo";

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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getDbSession();
	const userId = session?.userId;
	const user = userId ? await getUserById(userId) : null;

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<nav>
					<input type="checkbox" id="nav-toggle" />
					<label htmlFor="nav-toggle" className="nav-toggle-label">
						☰ Menu
					</label>

					<ul className="nav-menu">
						<li>
							<Link href="/">Home</Link>
						</li>
						{user ? (
							<li>
								<Link href="#/user/dashboard">Dashboard</Link>
							</li>
						) : null}
						{user ? (
							<li>
								<Link href="#/user/payments">Payments</Link>
							</li>
						) : null}
						<li>
							<Link href="#/about">About</Link>
						</li>
					</ul>
				</nav>

				{children}
			</body>
		</html>
	);
}
