<section>
	<div class="form-card">
		<h2>Otorgar premio</h2>
		<form id="formGrant" method="post" action="grantPrize">
			<fieldset>
				<legend>Datos obligatorios</legend>
				<label for="selGrantPrize">Premio</label>
				<select id="selGrantPrize" name="prize" required>
					<option value="no selection" disabled selected>Premio *</option>
					<!-- It's filled from JS -->
				</select>
				<label for="txtGrantCi">C.I.</label>
				<input id="txtGrantCi" type="text" name="ci" placeholder="C.I. *" onkeyup="validateci()" onfocus="checkIfPrize()" autocomplete="off" required>
			</fieldset>
			<fieldset>
				<legend>Datos opcionales</legend>
				<label for="txtGrantName1">Nombre</label>
				<input class="input-name" id="txtGrantName1" type="text" name="name1" placeholder="Nombre">
				<input class="input-name" id="txtGrantLastname1" type="text" name="lastname1" placeholder="Apellido">
				<label for="lstGrantGender">Sexo</label>
				<select id="lstGrantGender" name="gender" title="Seleccione sexo">
					<option value="no selection" disabled selected>Sexo</option>
					<option value="Femenino">Femenino</option>
					<option value="Masculino">Masculino</option>
					<option value="Otro">Otro</option>
				</select>
				<label for="txtGrantFacebook">Perfil de Facebook</label>
				<input id="txtGrantFacebook" type="text" name="facebook" placeholder="Perfil de Facebook">
				<label for="txtGrantPhone">Teléfono</label>
				<input id="txtGrantPhone" type="tel" name="phone" placeholder="Teléfono">
				<label for="txtGrantMail">Email</label>
				<input id="txtGrantMail" type="mail" name="mail" placeholder="Email">
			</fieldset>

			<button id="subConditional" class="w100" type="submit">Otorgar</button>

			<div id="divPrevPrizes" class="hidden"></div>

			<button id="subAnyway" type="submit" class="w50 hidden">Otorgar</button>
			<button id="subCancel" class="w50 hidden">Cancelar</button>

		</form>
	</div>
</section>

<section>
	<div class="form-card">
		<h2>Alta de premios</h2>
		<form method="post" action="newPrize">
			<fieldset>
				<legend>Datos obligatorios</legend>
				<label>Tipo de premio</label>
				<input list="prizesTypeList" title="Seleccione un tipo de premio" name="type" placeholder="Tipo de premio *" autocomplete="off" required>
				<datalist id="prizesTypeList"><!-- It's filled from JS --></datalist>

				<label>Espónsor</label>
				<input list="sponsorsList" title="Seleccione un sponsor" name="sponsor" placeholder="Espónsor *" autocomplete="off" required>
				<datalist id="sponsorsList"><!-- It's filled from JS --></datalist>
				<label>Descripción</label>
				<input type="text" name="description" placeholder="Descripción *" autocomplete="off" required>
				<label>Cantidad</label>
				<input type="number" name="quantity" placeholder="Cantidad *" min="1" required>
			</fieldset>
			<fieldset>
				<legend>Datos opcionales</legend>
				<label>Vencimiento</label>
				<input type="date" name="due_date" title="Fecha de Vencimiento">

				<label>Notas</label>
				<textarea name="note" placeholder="Información adicional" autocomplete="off"></textarea>

			</fieldset>
			<button type="submit" class="w100">Crear</button>
		</form>
		<p><%= errorMessage %></p>
	</div>
</section>

<section class="w100">
	<div class="form-card">
		<h2>Edición de premios</h2>
		<form id="prizeEdit" method="post" action="prizeEdit">
			<fieldset>
				<legend>Selección de premio</legend>
				<label for="selEditPrize">Premio</label>
				<select id="selEditPrize" name="prize" required>
					<option value="no selection" disabled selected>Premio *</option>
					<!-- It's filled from JS -->
				</select>
			</fieldset>
			<fieldset>
				<legend>Edición de premio</legend>
				<label>Tipo de premio</label>
				<input list="prizesTypeList" title="Edite el tipo de premio" id="sel_prize_type" name="type" placeholder="Tipo de premio *" autocomplete="off" required>
				<label>Espónsor</label>
				<input list="sponsorsList" title="Edite el sponsor" id="sel_prize_sponsor" name="sponsor" placeholder="Espónsor *" autocomplete="off" required>
				<label>Descripción</label>
				<input type="text" id="sel_prize_description" name="description" placeholder="Descripción *" autocomplete="off" required>
				<label>Cantidad</label>
				<input type="number" id="sel_prize_quantity" name="quantity" placeholder="Cantidad *" min="0" required>
				<label>Vencimiento</label>
				<input type="date" id="sel_prize_due_date" name="due_date" title="Fecha de Vencimiento">
				<label>Notas</label>
				<textarea id="sel_prize_note" name="note" placeholder="Información adicional" autocomplete="off"></textarea>
			</fieldset>
			<button class="w100" type="submit">Guardar</button>

		</form>
		<p><%= errorMessage %></p>
	</div>
</section>
