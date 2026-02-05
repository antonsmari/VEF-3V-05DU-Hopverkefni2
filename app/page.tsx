import Image from "next/image";

export default function Home() {
	return (
		<div>
			<p>
				Íslenska: Vefsíðan okkar hentar þér því að hún getur haldið utan
				um skuldir og eignir hópsins á einfaldan hátt. Með því að nota
				síðuna okkar getur þú og þinn hópur forðast misskilning og
				ágreining um peninga og einblínt á skemmtilegar stundir saman!
			</p>
			<p>
				English: Our website is suitable for you because it can keep
				track of the debts and assets of the group in a simple way. By
				using our website, you and your group can avoid
				misunderstandings and disagreements about money and focus on
				having fun together!
			</p>
			<div>
				<p>Login</p>
				<button>
					<a href="/login">Login</a>
				</button>
			</div>
			<div>
				<p>Sign Up</p>
				<button>
					<a href="/register">Sign Up</a>
				</button>
			</div>
		</div>
	);
}
