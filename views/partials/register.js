<section>
   <div class="form-card">
      <div id="ctrlWrapper">
         <!-- <p>Registro</p> -->
         <form method="post" action="register">
            <input type="text" name="user" placeholder="Nombre de usuario *" required>
            <input type="password" id="txtPass" name="pass" placeholder="Contraseña *" minlength="5" required>
            <!-- <input type="password" id="txtPass2" name="pass2" placeholder="Repetir Contraseña *" onkeyup="validatePassword()" required> -->
            <input type="email" name="email" placeholder="Email">
            <label for="selRole">Tipo de usuario: </label>
            <select id="selRole" name="role">
               <option value="user">Usuario</option>
               <option value="edit">Editor</option>
               <option value="admin">Administrador</option>
            </select>
            <button type="submit">Crear</button>
         </form>
         <p><small><i id="errorBox"> <%= errorMessage %> </i></small></p>
      </div>
   </div>
</section>
