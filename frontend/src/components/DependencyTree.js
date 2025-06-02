export const DependencyTree = ({ deps, onSelectPackage }) => {
  if (!deps || deps.length === 0) return null;

  return (
    <ul className="list-group list-group-flush ms-3">
      {deps.map((dep) => (
        <li key={dep.id} className="list-group-item p-1">
          <button
            className="btn btn-link p-0 m-0"
            onClick={() => onSelectPackage(dep.id)}
          >
            {dep.name}
          </button>
          {dep.dependencies && dep.dependencies.length > 0 && (
            <DependencyTree
              deps={dep.dependencies}
              onSelectPackage={onSelectPackage}
            />
          )}
        </li>
      ))}
    </ul>
  );
};
