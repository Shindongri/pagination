import React from 'react';
import styled from '@emotion/styled/macro';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { AiOutlineEllipsis } from 'react-icons/ai'

interface Props {
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
}

const Navigation = styled.nav``;

const Button = styled.button<{ selected?: boolean }>`
  color: ${({ selected }) => selected ? '#fff' : '#000'};
  border: 0;
  margin: 0;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: normal;
  background-color: ${({ selected }) => selected ? '#3d6afe' : '#fff'};
  cursor: pointer;
  border-radius: 100%;
  width: 48px;
  height: 48px;
  &:hover {
    background-color: #ccc;
    color: #fff;
  }
  &:active {
    opacity: 0.8;
  }
`;

const PaginationItem = styled.li``;

const PaginationItemList = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  list-style: none;
  ${PaginationItem} + ${PaginationItem} {
    margin-left: 8px;
  }
`;

const Pagination: React.FC<Props> = ({ count, page, onPageChange, disabled, siblingCount = 1, boundaryCount  = 1 }) => {
  const range = (start: number, end: number) => {
    const length = end - start + 1;

    return Array.from({ length }).map((_, index) => index + start);
  };

  const getLabel = (item: number | string) => {
    if (typeof item === 'number') return item;
    else if (item.indexOf('ellipsis') > -1) return <AiOutlineEllipsis />;
    else if (item.indexOf('prev') > -1) return <GrFormPrevious />;
    else if (item.indexOf('next') > -1) return <GrFormNext />;
    else return item;
  }

  const startPage = 1;
  const endPage = count;

  const startPages = range(startPage, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

  const siblingsStart = Math.max(
    Math.min(
      page + 1 - siblingCount,
      count - boundaryCount - siblingCount * 2 - 1,
    ),
    boundaryCount + 2
  );

  const siblingsEnd = Math.min(
    Math.max(
      page + 1 + siblingCount,
      boundaryCount + siblingCount * 2 + 2,
    ),
    endPages.length > 0 ? endPages[0] - 2 : endPage - 1,
  );

  const itemList = [
    'prev',
    ...startPages,
    ...(siblingsStart > boundaryCount + 2 ? ['start-ellipsis'] : boundaryCount + 1 < count - boundaryCount ? [boundaryCount + 1] : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundaryCount - 1 ? ['end-ellipsis'] : count - boundaryCount > boundaryCount ? [count - boundaryCount] : []),
    ...endPages,
    'next'
  ];

  const items = itemList.map((item, index) => (
    typeof item === 'number' ? {
        key: index,
        onClick: () => onPageChange(item - 1),
        disabled,
        selected: item - 1 === page,
        label: getLabel(item),
      } :
      {
        key: index,
        onClick: () => onPageChange(item === 'next' ? page + 1 : page - 1),
        disabled: disabled || item.indexOf('ellipsis') > -1 || (item === 'next' ? page >= count - 1 : page - 1 < 0),
        selected: false,
        label: getLabel(item),
      }
  ));

  return (
    <Navigation>
      <PaginationItemList>
        {
          items.map(({ key, disabled, selected, onClick, label }) => (
            <PaginationItem key={key}>
              <Button disabled={disabled} selected={selected} onClick={onClick}>{label}</Button>
            </PaginationItem>
          ))
        }
      </PaginationItemList>
    </Navigation>
  )
}

export default Pagination;
