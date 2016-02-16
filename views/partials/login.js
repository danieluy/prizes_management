<section>
	<div class="form-card">
		<h2>Inicio de Sesión</h2>
		<div id="ctrlWrapper">
			<form method="post" action="login">
				<input type="text" name="user" placeholder="Nombre de usuario" required>
				<input type="password" name="pass" placeholder="Contraseña" required>
				<button type="submit">Ingresar</button>
			</form>
			<p><small><i> <%= errorMessage %> </i></small></p>
		</div>
	</div>
</section>
