{
  inputs = {
    nixpkgs.url = "nixpkgs";
  };

  outputs =
    { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { system = system; };

          dependencies = with pkgs; [
            nodejs_23
          ];
        in
        {
          default = pkgs.mkShell {
            buildInputs = dependencies;

            shellHook = ''
              cat <<EOF

              Development environment ready!

              Available commands:
               - 'npm run serve'   # Start development server
               - 'npm run build'   # Build the site in the _site directory

              EOF

              git pull
            '';
          };
        }
      );
    };
}
