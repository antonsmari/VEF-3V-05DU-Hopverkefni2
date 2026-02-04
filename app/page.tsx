import Image from "next/image";

export default function Home() {
	return (
		<div>
			<p>
				vefsíðan okkar hentar þér því að hún getur haldið utan um
				skuldir og eignir hópsins á einfaldan hátt. Með því að nota
				síðuna okkar getur þú og þinn hópur forðast misskilning og
				ágreining um peninga og einblínt á skemmtilegar stundir saman!
			</p>
			<div>
				<p>log in</p>
				<button>
					<a href="/login">Login</a>
				</button>
			</div>
			<div>
				<p>sign up</p>
				<button>
					<a href="/register">Sign Up</a>
				</button>
			</div>
		</div>
	);
}
