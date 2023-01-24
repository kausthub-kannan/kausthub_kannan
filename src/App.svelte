<script>
    import { onMount } from "svelte";
	import { fade, slide } from "svelte/transition";
	import { Motion } from 'svelte-motion';
    let i = 0;
	let animate=false;
	let curve="curve1.png"

	onMount(() => {
    animate = true
  })
</script>

{#if animate}
<main in:fade={{duration:1000}}>
	<div class="navbar">
		<img class="wave" src="wave.png" alt=""/>
	</div>
		<div>
			<img class="logo" src="images/avatar.png" alt=""/>
		</div>
	<div class="content">
		<div class="icon-tech">
			<img style="width:14%" alt="" src="icons/tech/mongodb.png" />
			<img style="width:13%" alt="" src="icons/tech/nodejs.png" />
			<img style="width:13%" alt="" src="icons/tech/react.png" />
			<img style="width:13%" alt="" src="icons/tech/tensorflow.png" />
			<img style="width:23%" alt="" src="icons/tech/sveltejs.png" />
		</div>
		<h1>Kausthub's studio</h1>
		<p>Web and Ai Developer</p>
	</div>
	<div class="media-icons">
		<img style="width:14%" alt="" src="icons/github.png" />
		<img style="width:13%" alt="" src="icons/linkedin.png" />
	</div>

	<div class="skill-content">
		<img id="curve" src={curve} alt="" />
		<h1 class="headings">Automate Your Products using AI</h1>
		<img class="cat" alt="" src="casualCat.png" />
		<img id="mac-screen"src="images/mac.png" alt="" />
	</div>

	<div class="skill-content">
		<img id="curve" src="curve2.png" alt="" />
		<img class="cat2" alt="" src="backCat.png" />
		<p class="content2">Design confident, user appealing applications OWO</p>
	</div>

	<footer>Copyrights reserved @ 2023</footer>

</main>
{/if}

<style>

	.content2{
		font-size: 3rem;
		position: absolute;
		right: 300px;
		width: 25%;
		top: 1550px;
		text-align: center;
	}

	.cat{
		width: 14%;
		position: absolute;
		right:0;
		top: 715px;
	}

	.cat2{
		width: 14%;
		position: absolute;
		right: 1000px;
		top: 1450px;
	}

	#mac-screen{
		width:50%;
		border-radius: 10px;
		margin: 5% 0 0 48%;
		box-shadow: 0 8px 16px 0 rgba(108, 0, 151, 0.267), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}

	.headings{
		position: absolute;
		width: 7%;
		font-size: 3rem;
		margin: 12% 0 0 16%;
		color: white;
	}

	#curve{
		width: 45%;
		position: absolute;
		z-index: -1;
	}

	.wave{
		margin: -1%;
		width: 101.5%;
		height: 30vh;
	}

	h1{
		font-size: 4.5rem;
		font-weight: 200	;
	}

	.media-icons{
		position: absolute;
		top: 400px;
		margin-left: 47%;
	}

	p{
		font-size: 1.4rem;
		margin: -5%;
		margin-left: 1%;
	}

	.logo{
		width: 50%;
		margin-top: -15%;
		left:0;
		transform: rotate(-20deg);
	}

	.icon-tech{
		width: 50%;
		position: absolute	;
	}

	.content{
		position: absolute;
		top: 150px;
		right: 150px;
	}

	img{
		margin: 1%;
	}

	footer{
		position: absolute;
		top: 1900px;
		text-align: center;
		font-size: 1.5rem;
		right: 550px;
	}


</style>