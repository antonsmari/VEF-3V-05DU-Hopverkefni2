"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export default function Home() {
	const logos = [
		"/images/EVENTLY-logo-pink.svg",
		"/images/EVENTLY-logo-purple.svg",
		"/images/EVENTLY-logo-blue.svg",
		"/images/EVENTLY-logo-yellow.svg",
	];

	const randomLogo = useMemo(() => {
		return logos[Math.floor(Math.random() * logos.length)];
	}, []);

	return (
		<main className="home">
			<section className="hero">
				<Image src={randomLogo} alt="Evently Logo" width={400} height={400} className="hero-logo" priority/>
				<h1>A simpler way to manage shared expenses</h1>
			</section>

			<section className="intro">
				<div className="intro-text">
					<p>
						Sharing expenses with others shouldn’t be stressful. Whether
						you’re living with roommates, planning a trip, or managing
						ongoing group costs, keeping track of who paid for what can
						quickly become confusing.
					</p>

					<p>
						Our platform is designed to make shared finances clear and
						manageable. By organizing expenses into groups and events,
						everyone involved can see what was purchased, how much it
						cost, and how payments are split — without spreadsheets or
						mental math.
					</p>

					<p>
						Create or join a group using an invite code, add expenses as
						they happen, and approve transactions together. All activity
						is archived in one place, making it easy to track balances,
						confirm payments, and avoid misunderstandings.
					</p>
				</div>

				<div className="intro-pattern moving-pattern"></div>
			</section>

			<section className="features">
				<div className="feature">
					<p>Create and organize groups easily</p>
					<span>✦</span>
				</div>

				<div className="feature">
					<p>Track and approve shared expenses</p>
					<span>➞</span>
				</div>

				<div className="feature">
					<p>Settle payments transparently</p>
					<span>$</span>
				</div>
			</section>

			<section className="pattern-strip">
				<div className="pattern-strip-inner moving-pattern"></div>
			</section>

			<section className="auth">
				<div className="auth-box">
					<p className="auth-text">Already have an account?</p>
					<h3>Login</h3>
					<Link href="/login">
						<button>Login</button>
					</Link>
				</div>

				<div className="auth-box">
					<p className="auth-text">New here? Create your account</p>
					<h3>Sign Up</h3>
					<Link href="/register">
						<button>Sign Up</button>
					</Link>
				</div>
			</section>
		</main>
	);
}